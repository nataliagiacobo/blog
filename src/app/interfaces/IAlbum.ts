import { IImageResponse } from "./IImage";
import { IUser } from "./IUser";

export interface IAlbumRequest {
    name?: string;
    description?: string;
    userId?: number;
}

export interface IAlbumResponse {
    id?: number;
    name?: string;
    description?: string;
    user?: IUser;
    photos?: string[];
}

