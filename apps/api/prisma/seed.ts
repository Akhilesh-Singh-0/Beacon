import {prisma} from "../src/lib/prisma";

async function main(){
    const workspace = await prisma.Workspace.create({
        data:{
            name: "Beacon Test Workspace",
            slug: "beacon-test",
        }
    });

    const apiKey = await prisma.ApiKey.create({
        data:{
            apiKey: "bk_live_test123",
            workspaceId: workspace.id,
        }
    });

    console.log("Seed completed successfully");
    console.log(`Workspace ID: ${workspace.id}`);
    console.log(`API Key: ${apiKey.apiKey}`);
}

main()
  .catch((error) => {
    console.error("seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
