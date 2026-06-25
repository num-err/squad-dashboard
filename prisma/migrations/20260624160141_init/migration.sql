-- CreateTable
CREATE TABLE "leetcode_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "logged_date" TEXT NOT NULL,
    "logged_at" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "standup_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member" TEXT NOT NULL,
    "log_date" TEXT NOT NULL,
    "message" TEXT,
    "logged_at" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "linkedin_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member" TEXT NOT NULL,
    "post_url" TEXT,
    "theme" TEXT,
    "posted_date" TEXT NOT NULL,
    "logged_at" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "sprint_goals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member" TEXT NOT NULL,
    "goal_text" TEXT NOT NULL,
    "track" TEXT NOT NULL,
    "sprint_start" TEXT NOT NULL,
    "sprint_end" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TEXT
);

-- CreateTable
CREATE TABLE "applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "applied_date" TEXT NOT NULL,
    "notes" TEXT,
    "updated_at" TEXT NOT NULL
);
