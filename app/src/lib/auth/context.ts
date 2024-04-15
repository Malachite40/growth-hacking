import { currentUser } from "@clerk/nextjs/server"
import { db } from "~/server/db"

export async function getUser() {
  const user = await currentUser()

  if (!user)
    return {
      user: null,
    }

  const db_user = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      OrganizationUserRole: {
        include: {
          organization: true,
        },
      },
      UserSettings: true,
    },
  })

  if (!db_user || !db_user.UserSettings)
    return {
      user: null,
    }

  return {
    user: db_user,
    organizations: db_user.OrganizationUserRole.map(
      (role) => role.organization,
    ),
    roles: db_user.OrganizationUserRole,
    selectedOrganization: db_user.UserSettings.selectedOrganizationId
      ? db_user.OrganizationUserRole.find(
          (role) =>
            role.organizationId ===
            db_user.UserSettings?.selectedOrganizationId,
        )?.organization
      : db_user.OrganizationUserRole[0]?.organization,
  }
}
