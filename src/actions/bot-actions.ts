"use server";

import { fetchMutation } from "convex/nextjs";
import type { WithoutSystemFields } from "convex/server";
import { ConvexError } from "convex/values";

import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export async function addBot(
  bot: Omit<WithoutSystemFields<Doc<"bots">>, "progress" | "isDb">,
  fileKeys: string[]
) {
  const fileUrls = fileKeys.map(
    (fileKey) => `${process.env.S3_BUCKET_URL}${fileKey}`
  );

  try {
    const botId = await fetchMutation(api.bots.add, {
      completionModel: bot.completionModel,
      embeddingModel: bot.embeddingModel,
      name: bot.name,
      fileUrls,
    });

    return {
      success: true,
      message: "Bot created successfully",
      result: botId,
    };
  } catch (error: any) {
    let errorMessage = error.message || "Unexpected error occurred";
    if (
      error instanceof ConvexError &&
      error.data &&
      typeof error.data === "string"
    ) {
      errorMessage = error.data;
    }

    console.error("Error creating a bot:", error);

    return {
      success: false,
      message: errorMessage,
      result: undefined,
    };
  }
}

export async function deleteBot(botId: Id<"bots">) {
  try {
    await fetchMutation(api.bots.remove, { botId });

    return {
      success: true,
      message: "Bot deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting a bot:", error);

    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
}

export async function addBotWithDb(
  bot: Omit<WithoutSystemFields<Doc<"bots">>, "progress" | "isDb">,
  database: Omit<WithoutSystemFields<Doc<"database">>, "botId">
) {
  try {
    const botId = await fetchMutation(api.bots.addWithDb, {
      completionModel: bot.completionModel,
      embeddingModel: bot.embeddingModel,
      name: bot.name,
      dbUrl: database.url,
      dbType: database.type,
      tables: database.tables,
    });

    return {
      success: true,
      message: "Bot created successfully",
      result: botId,
    };
  } catch (error: any) {
    let errorMessage = error.message || "Unexpected error occurred";
    if (
      error instanceof ConvexError &&
      error.data &&
      typeof error.data === "string"
    ) {
      errorMessage = error.data;
    }

    console.error("Error creating a bot:", error);

    return {
      success: false,
      message: errorMessage,
      result: undefined,
    };
  }
}
