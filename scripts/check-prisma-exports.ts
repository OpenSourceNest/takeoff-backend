
import * as Prisma from "@prisma/client";

console.log("Prisma Exports Keys:", Object.keys(Prisma));
try {
    // @ts-ignore
    console.log("Gender:", Prisma.Gender);
    // @ts-ignore
    console.log("Profession:", Prisma.Profession);
} catch (e) {
    console.error(e);
}
