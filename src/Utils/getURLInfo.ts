export const getFanFictionBookid = (url: string) => {
	const bookid = url.split('/')[4];
	if (bookid.includes('?')) return bookid.split('?')[0];
	return bookid;
};
export const getWattpadBookid = (
	url: string,
	type: 'user' | 'chapter' | 'story',
) => {
	console.log(url.split('/'));
	if (type === 'story' || type === 'chapter') {
		return url.split('/')[type === 'story' ? 4 : 3].split('-')[0];
	}
	return url.split('/')[4];
};
export const getAO3Bookid = (url: string) => {
	const bookid = url.split('/')[4];
	if (bookid.includes('?')) return bookid.split('?')[0];
	return bookid;
};
export default function getURLInfo(url: string) {
	console.log(url);
	// https://www.wattpad.com/story/224719642-harmonizing-with-him
	const urls = ['fanfiction', 'wattpad', 'archiveofourown'];
	const urlArray = url.split('/');

	const site = urlArray[2].split('.').filter((x) => urls.includes(x))[0];

	if (site === 'fanfiction') {
		if (urlArray[3] === 's') {
			return {
				site: 'fanfiction',
				id: getFanFictionBookid(url),
				type: 'story',
			};
		} else if (urlArray[3] === 'u') {
			return {
				site: 'fanfiction',
				id: getFanFictionBookid(url),
				type: 'user',
			};
		}
	}
	if (site === 'wattpad') {
		if (urlArray[3] === 'story') {
			return {
				site: 'wattpad',
				id: getWattpadBookid(url, 'story'),
				type: 'story',
			};
		}
		if (urlArray[3] === 'user') {
			return {
				site: 'wattpad',
				id: getWattpadBookid(url, 'user'),
				type: 'user',
			};
		}
		if (urlArray[3].includes('-')) {
			return {
				site: 'wattpad',
				id: getWattpadBookid(url, 'chapter'),
				type: 'chapter',
			};
		}
	}
	if (site === 'archiveofourown') {
		if (urlArray[3] === 'series') {
			return {
				site: 'archiveofourown',
				id: getAO3Bookid(url),
				type: 'series',
			};
		}
		if (urlArray[3] === 'works') {
			return {
				site: 'archiveofourown',
				id: getAO3Bookid(url),
				type: 'story',
			};
		}
		if (urlArray[3] === 'users') {
			return {
				site: 'archiveofourown',
				id: getAO3Bookid(url),
				type: 'user',
			};
		}
	}
}
