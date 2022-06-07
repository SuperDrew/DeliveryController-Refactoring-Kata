import {EmailGateway} from "./emailGateway";

describe("When sending an email", () => {
    it("should get to the SMTP server", async () => {
        const env = "test";
        const emailGateway = new EmailGateway(env);
        const foo = await emailGateway.sendEmail("test", "randy.crona5@ethereal.email", "this is the message");
        expect(foo).toBeDefined();
        expect(foo.accepted[0]).toBe("randy.crona5@ethereal.email");
    });
})