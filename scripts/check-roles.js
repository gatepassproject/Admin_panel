const admin = require('firebase-admin');

const config = {
    credential: admin.credential.cert({
        projectId: "iot-system-65506",
        clientEmail: "firebase-adminsdk-fbsvc@iot-system-65506.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC9Y2XN2+XmLuBO\nixr3Z8dg2tIKC+iSdfj9V4DcCjac0ZT6an5WfBnNS2bJMYgsSkZ8bIyM0THUMkDE\ngErJte8OHXfwM3f9vQ+Ee/QHiG6dar+qNRXoEqHJtpGnWn8lLEaAUcbf7GvpGS6Z\nM0AAa6ZTBhSmr5PV9KhnFkukURfjFUzJaWo0bTydaa7EBRv/ZNJPQCrhglHvVYTK\n/W/amfOW4y6MHOeQaFAW9ZbQP6Ato3NSxotp4+YfIlNfuXL7qEthDp3Sk8iyGFww\nvGmlOFOofmUqRWY7M2geaBWHPfJ5CfqrAEv3nyaDfsjNR1y3ktF2ga09dbI1lWtk\nJwaWUt0VAgMBAAECggEADCDSquzPYPQ1C0qcuuXI4/K3cIsZL9HsFKXse7WQEERa\nqZu1b1U/XhaF+fyY928ilZgU+x/wHzeVpA/W2j/d/oB+xww2EwgvDMwBpr7YXe6G\ntirJS5qahPKoYA2ApsaFAErcX8gsk+730o9F5Luqw9aCmYxqZ6alPIQgwCCCVVl8\n/5cu7rufc5mJf82jZ7Fx/K5yFMmIflnFcr61IDhkWxwECurCWpisHNm7zm3Mq6by\ndpNcep0dHhuoTofBrx8TzBy12TtDpUdpcl+E07H/CcpnGtJjbjVAWbFik06m3hr3\nJtdXt46H74rgMjdxw5SyuoCx//W2abzngbtKSuFfwQKBgQDrXHL8mY+M+JXG4KZv\ndKI5GMAX2n5XHAk+wAloqusvdUd2kbY/y1CxlCRApRKg5j/hOXGyMu1RTe7nInpi\nGU+2YzBuZV/HW0EUkbXKmZOo/ziT68sLo9Te5iNYPM7JvevTFJgXECxX1bCpE8k6\nrYgqMFn/dG9WaZUJJroPRWTCwQKBgQDN/urwXh1PZafdaqNMYAKhIoHrMTVcNZgN\n9HTD76uPI9EsY+XDEeGJm6ClbfyTGnUVyQyvfoHZYTVj3Gtu8wCsv6kW8eFd3TwI\nhxTcsLzc+f7zOy88WJeUfg9xKN813DGKiBk2N3JE3Iz4MA1tOMXYUZoIeoN8nH2i\n/DeBdEHzVQKBgQDFcN69bQzxk7ACEH9OzKcyAsNSv2ZxKQHQdETwW0HEpDv5Ca+7\nwJHHBqGK4W/JLp60D/6DIRnYtOoPV+sW1Gj8diUw1zYMBU+JM9svRLqMcN5DqPDC\nqQNwodtQsGJA92QXxRT5dAXfAVKb5A9RfDXYPouhM0obUaNG9Aftu6cVgQKBgQCb\ntfzbcxjOwnXQXeJQQibarJ3uLYU7TVvB+K4myc0x5w4fcufju2lzvksBoZERlSc6\nL35CTetTaTKVaLFg7Zjt+/aR3IbRkADoJUu0wngQxXxdWbiL8h+qZFvB2vZW3Top\nkFUWcXUT7m800AXmMMsEiDJaBFnN4PDrOaGvXjTX/QKBgQCt+A2vVsH70Zj5Sp3K\ndqENLC1NlTFMETu0ErDVXaBgKNy2xpJeDXrUSg+LPGpXaWfgOEsCG5tRaEkrZkcv\nW77VQTzL8RAHoUqfBjLmCOJ8IEni1e91WVTzmv/WqSDhFHnGleQVgjXnnS4wQhE2\nJd9FrIIIoP7S9h/9EN4fwiBW2g==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
    }),
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

const db = admin.firestore();

async function checkUsers() {
    const snapshot = await db.collection('users').get();
    console.log(`Total users in Project 2: ${snapshot.size}`);
    const roles = new Set();
    snapshot.forEach(doc => {
        const data = doc.data();
        roles.add(data.role);
        console.log(`User: ${data.email || 'N/A'}, Role: ${data.role}`);
    });
    console.log('Unique Roles found:', Array.from(roles));
}

checkUsers().catch(console.error);
