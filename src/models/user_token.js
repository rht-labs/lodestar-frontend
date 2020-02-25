export class UserToken {
    constructor({
        accessToken = '',
        refreshToken = '',
        accessTokenExpiry = '',
        refreshTokenExpiry = ''
    } = {}) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accessTokenExpiry = accessTokenExpiry;
        this.refreshTokenExpiry = refreshTokenExpiry;
    }
    accessToken = null;
    refreshToken = null;
    accessTokenExpiry = new Date();
    refreshTokenExpiry = new Date();

    toMap() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            accessTokenExpiry: this.accessTokenExpiry.toISOString(),
            refreshTokenExpiry: this.refreshTokenExpiry.toISOString()
        }
    }
    /**
     * 
     * @returns {UserToken}
     */
    static fromMap(map) {
        return new UserToken({
            accessToken: map['accessToken'],
            refreshToken: map['refreshToken'],
            accessTokenExpiry: Date.parse(map['accessTokenExpiry']),
            refreshTokenExpiry: Date.parse(map['refreshTokenExpiry'])
        })
    }
}