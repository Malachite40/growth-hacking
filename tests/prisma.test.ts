import fs from "fs";
import path from "path";

describe("Prisma Schema Check", () => {
  // Define the root directory of your mono-repo
  const rootDirectory = path.join(__dirname, "..");

  // Array of folders in the root directory you want to check
  const foldersToCheck: string[] = ["app", "jobs", "prisma"]; // Replace with the folder names you want to check

  // Check existence of schema.prisma in each directory
  foldersToCheck.forEach((dir) => {
    it(`should have schema.prisma in ${dir}`, () => {
      const hasPrismaSchema = fs.existsSync(
        path.join(rootDirectory, dir, "schema.prisma")
      );
      expect(hasPrismaSchema).toBe(true);
    });
  });

  // Check if the contents of schema.prisma are identical across directories
  it("should have identical schema.prisma contents across directories", () => {
    const firstPrismaContent = fs.readFileSync(
      path.join(rootDirectory, foldersToCheck[0], "schema.prisma"),
      "utf8"
    );

    for (let i = 1; i < foldersToCheck.length; i++) {
      console.log(foldersToCheck[i]);
      const prismaContent = fs.readFileSync(
        path.join(rootDirectory, foldersToCheck[i], "schema.prisma"),
        "utf8"
      );
      expect(prismaContent).toEqual(firstPrismaContent);
    }
  });
});
