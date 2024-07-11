

interface Token {
    data: UserToken
}

interface UserToken {
    token: string
    user_id: string
    role: string
}