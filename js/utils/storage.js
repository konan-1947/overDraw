/**
 * @fileoverview Helper functions for interacting with chrome.storage.local.
 */

/**
 * Gets a value from chrome.storage.local.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} A promise that resolves with the value, or undefined.
 */
export async function getStorage(key) {
    try {
        const result = await chrome.storage.local.get(key);
        return result[key];
    } catch (error) {
        console.error(`Error getting item ${key} from storage:`, error);
        return undefined;
    }
}

/**
 * Sets a value in chrome.storage.local.
 * @param {string} key - The key of the item to set.
 * @param {any} value - The value to set.
 * @returns {Promise<void>} A promise that resolves when the item is set.
 */
export async function setStorage(key, value) {
    try {
        await chrome.storage.local.set({ [key]: value });
    } catch (error) {
        console.error(`Error setting item ${key} in storage:`, error);
    }
}