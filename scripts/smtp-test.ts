// Simple SMTP connection test
export { };

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testSMTP() {
    console.log('\n🔍 Testing SMTP Configuration...\n');
    console.log('Configuration:');
    console.log(`  Host: ${process.env.SMTP_HOST}`);
    console.log(`  Port: ${process.env.SMTP_PORT}`);
    console.log(`  User: ${process.env.SMTP_USER}`);
    console.log(`  Pass: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET'}`);
    console.log(`  Timeout: ${process.env.SMTP_TIMEOUT}ms\n`);

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: Number(process.env.SMTP_TIMEOUT),
    });

    try {
        // Test 1: Verify connection
        console.log('📡 Test 1: Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!\n');

        // Test 2: Send a test email
        console.log('📧 Test 2: Sending test email...');
        const info = await transporter.sendMail({
            from: `"Takeoff Backend Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself for testing
            subject: 'SMTP Test - ' + new Date().toISOString(),
            text: 'This is a test email to verify SMTP functionality.',
            html: '<b>This is a test email to verify SMTP functionality.</b><p>Sent at: ' + new Date().toLocaleString() + '</p>',
        });

        console.log('✅ Test email sent successfully!');
        console.log('\nEmail Details:');
        console.log(`  Message ID: ${info.messageId}`);
        console.log(`  Response: ${info.response}`);
        console.log(`\n📬 Check inbox at: ${process.env.SMTP_USER}\n`);

        console.log('🎉 All SMTP tests passed!\n');
    } catch (error: any) {
        console.error('\n❌ SMTP Test Failed!');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.error('\n💡 Tip: Authentication failed. Check:');
            console.error('   1. SMTP_USER is correct');
            console.error('   2. SMTP_PASS is a valid App Password (not your regular Gmail password)');
            console.error('   3. 2-Step Verification is enabled in Gmail');
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            console.error('\n💡 Tip: Connection failed. Check:');
            console.error('   1. SMTP_HOST and SMTP_PORT are correct');
            console.error('   2. Your internet connection');
            console.error('   3. Firewall settings');
        }
        console.error('');
    }
}

testSMTP();
