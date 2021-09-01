exports.resetPwdBody = (resetLink, otp) => {
  return `<head>
    <style>
        .container {
            background-color: #F0F8FF;
            width: 95%;
            text-align: center;
            border: 1px solid;
            border-radius:5px;
        }

        .heading .footer {
            width: 100%;
            margin-bottom: 30px;
            text-align: left;
            color: #4c4c4c;
        }
        

        .linkbody {
            width: 100%;
            margin-bottom: 10px;
            text-align: center;
            color: white
        }

        button {
            /* text-decoration: none; */
            background-color: rgb(37, 103, 208);
            color: white;
            padding: 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="heading">
            <p>Someone (hopefully you) has requested a password reset for your Nodejs_API account. Follow the link below to
                set a new password:</p>
        </div>
        <div class="linkbody">
        <a href=${resetLink}>
                <button>Reset Password</button>
        </a>


        </div>
        <div class="">
            OTP ${otp} will expire in 10 min.
        </div>
        <div class="footer">
            <p>("If you don't wish to reset your password, disregard this email and no action will be
                taken.")</p>
        </div>

        <div class="">
          ${process.env.TEAM_NAME}<br>
          ${process.env.APP_URL}
        </div>
    </div>
</body>`;
};
