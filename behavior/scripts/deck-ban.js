import * as mc from "@minecraft/server";
import { DRAW_CARDS } from "./button.js";

/**
 * BAN可能なデッキのリストを取得
 * @returns {string[]} BAN可能なデッキ名の配列
 */
export function getBannableDecks() {
    const bannableDecks = [];

    if (mc.world.getDynamicProperty("overworld_bannable") ?? false) {
        bannableDecks.push("現世");
    }
    if (mc.world.getDynamicProperty("cave_bannable") ?? false) {
        bannableDecks.push("洞窟");
    }
    if (mc.world.getDynamicProperty("nether_bannable") ?? true) {
        bannableDecks.push("ネザー");
    }
    if (mc.world.getDynamicProperty("animal_bannable") ?? true) {
        bannableDecks.push("アニマル");
    }
    if (mc.world.getDynamicProperty("genocide_bannable") ?? true) {
        bannableDecks.push("残虐");
    }
    if (mc.world.getDynamicProperty("seaworld_bannable") ?? true) {
        bannableDecks.push("海洋");
    }

    return bannableDecks;
}

/**
 * ランダムにデッキをBANする
 * @returns {string[]} BANされたデッキ名の配列
 */
export function generateBannedDecks() {
    const bannableDecks = getBannableDecks();
    const banCount = mc.world.getDynamicProperty("deck_ban") ?? 0;

    if (banCount === 0 || bannableDecks.length === 0) {
        mc.world.setDynamicProperty("banned_decks", JSON.stringify([]));
        return [];
    }

    // ランダムにシャッフル
    const shuffled = [...bannableDecks].sort(() => Math.random() - 0.5);
    const bannedDecks = shuffled.slice(0, Math.min(banCount, bannableDecks.length));

    // 結果を保存
    mc.world.setDynamicProperty("banned_decks", JSON.stringify(bannedDecks));

    return bannedDecks;
}

/**
 * 現在BANされているデッキを取得
 * @returns {string[]} BANされたデッキ名の配列
 */
export function getBannedDecks() {
    const bannedData = mc.world.getDynamicProperty("banned_decks");
    return bannedData ? JSON.parse(bannedData) : [];
}

/**
 * 指定されたデッキがBANされているかチェック
 * @param {string} deckName デッキ名
 * @returns {boolean} BANされている場合true
 */
export function isDeckBanned(deckName) {
    const bannedDecks = getBannedDecks();
    return bannedDecks.includes(deckName);
}

/**
 * 利用可能なデッキのリストを取得
 * @returns {Object} 利用可能なDRAW_CARDSオブジェクト
 */
export function getAvailableDecks() {
    const bannedDecks = getBannedDecks();
    const availableDecks = {};

    for (const [key, value] of Object.entries(DRAW_CARDS)) {
        if (!bannedDecks.includes(key)) {
            availableDecks[key] = value;
        }
    }

    return availableDecks;
}