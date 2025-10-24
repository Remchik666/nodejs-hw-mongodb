import { registerUser, loginUser, logoutUser, refreshSession, requestResetToken, resetPassword } from '../services/auth.js';

export async function registerUserController(req, res) { 
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201, 
        message: "Successfully registered a user!",
        data: user
    });
}

export async function loginUserController(req, res) { 
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });

    res.send({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function logoutUserController(req, res) { 
    const { sessionId } = req.cookies;
    if (typeof sessionId == "string") { 
        await logoutUser(sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    
    res.send({ status: 204 });
}

export async function refreshSessionController(req, res) { 
    const { sessionId, refreshToken } = req.cookies;
    const session = await refreshSession(sessionId, refreshToken);

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });

    res.send({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function requestResetEmailController(req, res) { 
    await requestResetToken(req.body.email);
    res.json({
        message: "Reset password email has been successfully sent.",
        status: 200,
        data: {},
    });
}

export async function resetPasswordController(req, res) { 
    await resetPassword(req.body);

    res.json({
        message: 'Password was successfully reset!',
        status: 200,
        data: {},
    });
}