import { defineStore } from 'pinia'
import Api from '../api'

export type UserInfo = {
    name: string
    user_id: number
    visibility: boolean
}

export const useLoginStore = defineStore(
    {
        id: 'session',
        persist: {
            enabled: true,
            strategies: [
                { key: 'session', storage: localStorage }
            ]
        },
        state: () => ({
            accessToken: null as string | null,
            userInfo: null as UserInfo | null,
        }),
        actions: {
            reset() {
                this.accessToken = null
                this.userInfo = null
            },

            async change_name(): Promise<string> {
                if (!this.userInfo || !this.accessToken) {
                    return "need login"
                }
                return await Api.change_user_name(this.accessToken, this.userInfo.name)
                    .then((res) => {
                        this.userInfo = res
                        return "" + this.userInfo.name + "に更新しました。"
                    })
                    .catch(() => {
                        return "更新に失敗しました。"
                    })
            },
            async change_visibility(): Promise<string> {
                if (!this.userInfo || !this.accessToken) {
                    return "need login"
                }
                return await Api.change_visibility(this.accessToken, this.userInfo.visibility)
                    .then((res) => {
                        this.userInfo = res
                        return this.userInfo.visibility
                            ? "プロフィールを表示状態にしました。"
                            : "プロフィールを非表示状態にしました。"
                    })
                    .catch(() => {
                        return "更新に失敗しました。"
                    })
            }
        }
    }
)
