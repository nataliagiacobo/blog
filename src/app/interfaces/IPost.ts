import { ICommentResponse } from "./IComment";
import { IUser } from "./IUser";

export interface IPostRequest {
    content?: string;
    userId?: number;
}

export interface IPostResponse {
    id?: number;
    content?: string;
    user?: IUser;
    comments?: ICommentResponse[];
}