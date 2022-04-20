export interface bookType {
	buffer: Buffer;
	author: string;
	chapters: string;
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
	book: {
		title: string;
		data: string;
	}[];
}
