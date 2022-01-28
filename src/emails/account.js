const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = (email,name) => { 
    sgMail.send({
        to : email,
        from : 'yunisahmadbayli@gmail.com',
        subject : 'Task Manager App',
        text : `Hello Mr ${name}. Welcome to Task Manager App`
    })
}

const cancelEmail = (email,name) => { 
    sgMail.send({
        to: email,
        from : 'yunisahmadbayli@gmail.com',
        subject : 'Cancelled your account',
        text :   `See you again Mr ${name}`
    })
}

module.exports = {
    sendEmail,
    cancelEmail
}