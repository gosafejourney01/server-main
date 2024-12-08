import nodemailer from 'nodemailer';
import https from 'https';
import fs from 'fs';
// import { propertyBookingSchema } from "../models/propertyBooking";

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: 'kartikmehtatest@gmail.com',
		pass: 'qkeeqngqbpvzqbgz',
	},
});

export async function sendMail(email, OTP) {
	const otpMailOptions = {
		from: 'kartikmehtatest@gmail.com',
		to: email,
		subject: 'GoSafeJourney | Verify OTP',
		text: `OTP : ${OTP}`,
		html: '',
	};

	transporter.sendMail(otpMailOptions, (error, info) => {
		if (error) {
			console.log(error);
			return 0;
		}
		console.log('Message sent: %s', info.messageId);
	});
	return 1;
}

export async function sendInvoiceEmail(clientEmail, partnerEmail, bookingData) {
	const invoiceFilename = `invoice_${bookingData.bookingId}.pdf`;
	const invoicePath = `./${invoiceFilename}`;

	const invoice = {
		logo: 'http://invoiced.com/img/logo-invoice.png',
		from: 'GoSafeJourney\n123 Example Street\nCity, State, Country',
		to: 'Customer Name',
		currency: 'inr',
		number: bookingData.bookingId,
		payment_terms: 'Auto-Billed - Do Not Pay',
		items: [
			{
				name: 'Hotel Booking',
				quantity: bookingData.noBookedRooms,
			},
		],
		fields: {
			tax: '%',
		},
		tax: 5,
		notes: 'Thank you for choosing GoSafeJourney!',
		terms: 'No need to submit payment. You will be auto-billed for this invoice.',
	};

	const postData = JSON.stringify(invoice);
	const options = {
		hostname: 'invoice-generator.com',
		port: 443,
		path: '/',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData),
		},
	};

	const file = fs.createWriteStream(invoicePath);
	const req = https.request(options, function (res) {
		res.on('data', function (chunk) {
			file.write(chunk);
		}).on('end', function () {
			file.end();

			const invoiceMailOptions = {
				from: 'kartikmehtatest@gmail.com',
				to: [clientEmail, partnerEmail],
				subject: 'GoSafeJourney | Invoice',
				text: 'Please find the attached invoice for your booking.',
				attachments: [
					{
						filename: invoiceFilename,
						path: invoicePath,
					},
				],
			};

			transporter.sendMail(invoiceMailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Invoice email sent: %s', info.messageId);
					fs.unlinkSync(invoicePath);
				}
			});
		});
	});

	req.write(postData);
	req.end();

	return;
}
