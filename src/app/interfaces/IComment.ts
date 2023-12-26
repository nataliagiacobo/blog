import { IUser } from "./IUser";

export interface ICommentRequest {
    description?: string;
    userId?: number;
    postId?: number;
}

export interface ICommentResponse {
    id?: number;
    description?: string;
    user?: IUser;
}