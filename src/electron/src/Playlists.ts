import { app } from "electron";
import { ipcMain } from "electron";
import fs from "fs";
import path from "path";

const userDataPath = app.getPath("userData");
const playlists: any[] = [];

// Creates the default config files
const createSkeleton = (user: string) => {
	const userHome = path.join(userDataPath, user);
	try {
		fs.mkdirSync(userHome, { recursive: true });
		createIfNotExists(userHome, "playlists.json");
	} catch(error) {
		console.error("Failed to create skeleton files:", error);
	}
};

// Creates the file if it doesn't exist and initialises it to an empty array
const createIfNotExists = (userHome: string, file: string) => {
	const filePath = path.join(userHome, file);
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, "[]");
	}
};

// Extracts compatible fields from the json object into a track
const parseTracks = (items: any[]) => {
	const tracks: any[] = [];

	for (const item of items) {
		try {
			const track = {
				name: item.name,
				author: item.author,
				thumbnail: item.thumbnail,
				link: item.link
			};

			if (track.link) {
				tracks.push(track);
			}
		} catch(error) {
			console.error("Error loading track:", error);
		}
	}
	return tracks;
};

// Loads the playlists for the specified user
export const loadPlaylists = (user: string) => {
	createSkeleton(user);

	const playlistsFilePath = path.join(userDataPath, user, "playlists.json");
	const playlists: any[] = [];

	try {
		const fileData = fs.readFileSync(playlistsFilePath, "utf8");
		console.log("Loaded file:", fileData);
		const json = JSON.parse(fileData);

		for (const arrayItem of json) {
			try {
				const parsedPlaylist = {
					name: arrayItem.name,
					author: arrayItem.author,
					tracks: parseTracks(arrayItem.tracks)
				};

				if (parsedPlaylist.name && parsedPlaylist.tracks) {
					playlists.push(parsedPlaylist);
				}
			} catch(error) {
				console.error("Error loading playlist:", error);
			}
		}
	} catch (error) {
		console.error("Error loading playlists:", error);
	}

	return playlists;
};

// Saves the playlists for the specified user
export const savePlaylists = (user: string, playlists: any[]) => {
	const savePath = path.join(userDataPath, user, "playlists.json");

	try {
		const playlistData = JSON.stringify(playlists, null, 2);
		fs.writeFileSync(savePath, playlistData, "utf8");
	} catch(error) {
		console.error("Error saving playlists:", error);
	}
};

export const initPlaylists = () => {
	ipcMain.handle("load-playlists", (event, data) => {
		return loadPlaylists(data);
	});

	ipcMain.handle("add-playlist", (event, data) => {
		try {
			if (data) {
				playlists.push(data);
			}
		} catch(error) {
			console.error("Error adding playlist:", error);
		}
	});
}
