export interface bookType {
	buffer: Buffer;
	author: string;
	chapterLength: string;
	description: string;
	authorUrl: string;
	genre: string;
	language: string;
	published: string;
	rated: string;
	status: string;
	title: string;
	fandom: string;
	updated: string;
	words: string;
	id: string;
	uid: string;
	cover: string;
	url: string;
	extension: 'epub' | 'pdf' | 'html';
	chapters: {
		title: string;
		content: string;
		url: string;
	}[];
}
export interface unknownUserType {
	isUserLogin: false;
	downloads: number;
}
export interface userType {
	name: string;
	isUserLogin: true;
	userid: string;
	deviceID: string;
	email: string;
	downloads: number;
}
