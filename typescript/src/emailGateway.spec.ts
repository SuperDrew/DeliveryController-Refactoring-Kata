import {EmailGateway} from "./emailGateway";
import nodemailer from "nodemailer";

describe("When sending an email", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should use the correct nodemailer config', () => {
        // Arrange
        const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');

        // Act
        new EmailGateway();

        // Assert
        expect(createTransportSpy).toHaveBeenCalled();
        expect(createTransportSpy.mock.calls[0][0]).toStrictEqual({
            host: 'localhost',
            port: 25,
            secure: false,
            logger: true
        });
    })

    it('Should use the correct, subject, address and message', async () => {
        // Arrange
        const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');
        const emailGateway = new EmailGateway();
        const transporter = createTransportSpy.mock.results[0].value;
        const sendMailSpy = jest.spyOn(transporter, "sendMail").mockImplementation(() => Promise.resolve());

        // Act
        await emailGateway.sendEmail("subject", "to", "text");

        // Assert
        expect(sendMailSpy).toHaveBeenCalled();
        expect(sendMailSpy.mock.calls[0][0]).toStrictEqual({
            subject: "subject",
            to: "to",
            text: "text"
        })
    })
})