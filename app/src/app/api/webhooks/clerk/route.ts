import { WebhookEvent } from "@clerk/nextjs/server"
import { Prisma, RoleType } from "@prisma/client"
import { headers } from "next/headers"
import { env } from "process"
import { Webhook } from "svix"
import { db } from "~/server/db"

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const CLERK_WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    )
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  // Handle the event
  handleEvent(eventType, payload)

  console.log("Clerk Webhook received and handled successfully.")
  return new Response("", { status: 200 })
}

async function handleEvent(eventType: string, payload: any) {
  const userData = payload.data
  const userId = userData.id

  switch (eventType) {
    case "user.created":
      const createUserInput: Prisma.UserCreateInput = {
        id: userId,
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        birthday: userData.birthday,
        gender: userData.gender,
        primaryEmailAddress: userData.email_addresses[0].email_address,
        profileImageUrl: userData.profile_image_url,
        passwordEnabled: userData.password_enabled,
        twoFactorEnabled: userData.two_factor_enabled,
        lastSignInAt: new Date(userData.last_sign_in_at),
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
        primaryEmailAddressId: userData.primary_email_address_id,
        primaryPhoneNumberId: userData.primary_phone_number_id,
        primaryWeb3WalletId: userData.primary_web3_wallet_id,
        TokenBalance: {
          create: {
            count: 0,
          },
        },
        UserEmailAddresses: {
          create: userData.email_addresses.map((email: any) => ({
            id: email.id,
            emailAddress: email.email_address,
            verification: email.verification.status,
          })),
        },
        UserPhoneNumber: {
          create: userData.phone_numbers.map((phone: any) => ({
            id: phone.id,
            number: phone.number,
          })),
        },
        OrganizationUserRole: {
          create: {
            role: RoleType.OWNER,
            organization: {
              create: {
                name: "Personal",
                ownerId: userId,
              },
            },
          },
        },
        UserSettings: {
          create: {
            userId: userId,
          },
        },
      }
      const user = await db.user.create({
        data: createUserInput,
        include: {
          UserSettings: true,
          Organizations: true,
        },
      })

      if (!user || !user.UserSettings || !user.Organizations) return
      const settings = await db.userSettings.update({
        where: {
          userId: user.id,
        },
        data: {
          userId: user.id,
          selectedOrganizationId: user.Organizations[0]
            ? user.Organizations[0].id
            : undefined,
        },
      })
      break

    case "user.updated":
      const updateUserInput: Prisma.UserUpdateInput = {
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        birthday: userData.birthday,
        gender: userData.gender,
        profileImageUrl: userData.profile_image_url,
        passwordEnabled: userData.password_enabled,
        twoFactorEnabled: userData.two_factor_enabled,
        lastSignInAt: new Date(userData.last_sign_in_at),
        updatedAt: new Date(userData.updated_at),
        primaryEmailAddressId: userData.primary_email_address_id,
        primaryPhoneNumberId: userData.primary_phone_number_id,
        primaryWeb3WalletId: userData.primary_web3_wallet_id,
      }
      await db.user.update({
        where: { id: userId },
        data: updateUserInput,
      })
      break

    case "user.deleted":
      break
  }
}
