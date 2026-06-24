
import fs from "fs/promises"
import path from "path"

const DB_FILE = path.resolve(process.cwd(), "db.json")

interface DbData {
  scheduledPosts: any[];
  analytics: any[];
}

async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If file doesn't exist, return initial structure
      return { scheduledPosts: [], analytics: [] }
    }
    throw error
  }
}

async function writeDb(data: DbData): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8")
}

export const db = {
  async getScheduledPosts(): Promise<any[]> {
    const data = await readDb()
    return data.scheduledPosts
  },

  async addScheduledPost(post: any): Promise<void> {
    const data = await readDb()
    data.scheduledPosts.push(post)
    await writeDb(data)
  },

  async updateScheduledPost(id: string, updates: Partial<any>): Promise<void> {
    const data = await readDb()
    const index = data.scheduledPosts.findIndex((post) => post.id === id)
    if (index !== -1) {
      data.scheduledPosts[index] = { ...data.scheduledPosts[index], ...updates }
      await writeDb(data)
    }
  },

  async getAnalytics(): Promise<any[]> {
    const data = await readDb()
    return data.analytics
  },

  async addAnalyticsEntry(entry: any): Promise<void> {
    const data = await readDb()
    data.analytics.push(entry)
    await writeDb(data)
  },
}
