import { json, timestamp } from "drizzle-orm/pg-core";
// import { int, mysqlTable, varchar, text, datetime, primaryKey, mysqlEnum, boolean } from "drizzle-orm/mysql-core";
// import type { AdapterAccount } from "@auth/core/adapters";
// import { relations } from "drizzle-orm";
// export enum UserRoleEnum {
//   USER = "USER",
//   ADMIN = "ADMIN",
// }
// export const UserRole = mysqlEnum("UserRole", ["ADMIN", "USER"]);
// export const user = mysqlTable("user", {
//   id: varchar("id", { length: 255 }).notNull().primaryKey(),
//   name: varchar("name", { length: 255 }),
//   email: varchar("email", { length: 255 }).notNull().unique(),
//   emailVerified: datetime("emailVerified"),
//   image: varchar("image", { length: 255 }),
//   userRole: UserRole.default(UserRoleEnum.USER),
//   password: varchar("password", { length: 255 }),
//   isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
// });

// export const accounts = mysqlTable(
//   "account",
//   {
//     userId: varchar("userId", { length: 255 })
//       .notNull()
//       .references(() => user.id, { onDelete: "cascade" }),
//     type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
//     provider: varchar("provider", { length: 255 }).notNull(),
//     providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
//     refresh_token: varchar("refresh_token", { length: 255 }),
//     access_token: varchar("access_token", { length: 255 }),
//     expires_at: int("expires_at"),
//     token_type: varchar("token_type", { length: 255 }),
//     scope: varchar("scope", { length: 255 }),
//     id_token: varchar("id_token", { length: 2048 }),
//     session_state: varchar("session_state", { length: 255 }),
//   },
//   account => ({
//     pk: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//   })
// );

// export const verificationToken = mysqlTable(
//   "verificationToken",
//   {
//     id: varchar("id", { length: 255 }).notNull().primaryKey(),
//     email: varchar("email", { length: 255 }),
//     token: text("token").unique(),
//     expires: datetime("expires"),
//   },
//   verificationToken => ({
//     pk: primaryKey({
//       columns: [verificationToken.email, verificationToken.token],
//     }),
//   })
// );

// export const passwordResetToken = mysqlTable(
//   "passwordResetToken",
//   {
//     id: varchar("id", { length: 255 }).notNull().primaryKey(),
//     email: varchar("email", { length: 255 }),
//     token: text("token").unique(),
//     expires: datetime("expires"),
//   },
//   passwordResetToken => ({
//     pk: primaryKey({
//       columns: [passwordResetToken.email, passwordResetToken.token],
//     }),
//   })
// );

// export const twoFactorToken = mysqlTable(
//   "twoFactorToken",
//   {
//     id: varchar("id", { length: 255 }).notNull().primaryKey(),
//     email: varchar("email", { length: 255 }),
//     token: text("token").unique(),
//     expires: datetime("expires"),
//   },
//   twoFactorToken => ({
//     pk: primaryKey({
//       columns: [twoFactorToken.email, twoFactorToken.token],
//     }),
//   })
// );

// export const twoFactorConfirmation = mysqlTable("twoFactorConfirmation", {
//   id: varchar("id", { length: 255 }).notNull().primaryKey(),
//   userId: varchar("userId", { length: 255 })
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),
// });

// export const userRelations = relations(user, ({ one }) => ({
//   accounts: one(accounts, {
//     fields: [user.id],
//     references: [accounts.userId],
//   }),
//   twoFactorConfirmation: one(twoFactorConfirmation, {
//     fields: [user.id],
//     references: [twoFactorConfirmation.userId],
//   }),
// }));
import { integer, pgTable, text, primaryKey, pgEnum, boolean,serial } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}
export enum EventsEnum {
  MARRIAGE = "MARRIAGE",
  ENGAGEMENT = "ENGAGEMENT",
  FUNERAL = "FUNERAL",
  OTHER = "OTHER",
}
export const UserRole = pgEnum("UserRole", ["ADMIN", "USER"]);
export const user = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  userRole: UserRole("userRole").default("USER"),
  password: text("password"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => ({
    pk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationToken = pgTable(
  "verificationToken",
  {
    id: text("id").notNull(),
    email: text("email"),
    token: text("token").unique(),
    expires: timestamp("expires", { mode: "date" }),
  },
  // verificationToken => ({
  //   pk: primaryKey({
  //     columns: [verificationToken.email, verificationToken.token],
  //   }),
  // })
);

export const passwordResetToken = pgTable(
  "passwordResetToken",
  {
    id: text("id").notNull(),
    email: text("email"),
    token: text("token").unique(),
    expires: timestamp("expires", { mode: "date" }),
  },
  // passwordResetToken => ({
  //   pk: primaryKey({
  //     columns: [passwordResetToken.email, passwordResetToken.token],
  //   }),
  // })
);

export const twoFactorToken = pgTable(
  "twoFactorToken",
  {
    id: text("id").notNull(),
    email: text("email"),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }),
  },
  // twoFactorToken => ({
  //   pk: primaryKey({
  //     columns: [twoFactorToken.email, twoFactorToken.token],
  //   }),
  // })
);

export const twoFactorConfirmation = pgTable("twoFactorConfirmation", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
export const eventsEnum = pgEnum("eventType", ["MARRIAGE", "ENGAGEMENT", "FUNERAL", "OTHER"]);
export const events = pgTable("events", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  eventType: eventsEnum("eventType"),
  dateTime: timestamp("dateTime").notNull(),
  location: text("location"),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});
export const payers = pgTable("payers", {
  id: text("id").notNull().primaryKey(),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  city: text("city"),
  description: text("description"),
  amount: integer("amount").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});

export const flames = pgTable("flames", {
  id: serial('id').primaryKey(),
  name1:text("name1").notNull(),
  name2:text("name2").notNull(),
  relation:text("relation").notNull(),
  percentage:text("percentage").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});

export const Gender = pgEnum("Gender", ["MALE", "FEMALE"]);
export const answers = pgTable("answers", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  answers: json("answers").notNull(), 
  gender: Gender('gender'),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});
export const quizLinks = pgTable("quiz_links", {
  answerId: serial("answer_id").references(() => answers.id).notNull(), // Foreign key to the answers table
  link: text("link").notNull().primaryKey(), // The unique link identifier
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow(),
});

export const friendAnswers = pgTable('friendAnswers',{
  id: serial('id').primaryKey(),
  quizzId: text("quizz_id").references(() =>quizLinks.link).notNull(),
  name: text("name").notNull(),
  score:text("score").notNull(),
})
export const userRelations = relations(user, ({ one, many }) => ({
  accounts: one(accounts, {
    fields: [user.id],
    references: [accounts.userId],
  }),
  twoFactorConfirmation: one(twoFactorConfirmation, {
    fields: [user.id],
    references: [twoFactorConfirmation.userId],
  }),
  events: many(events),
  payers:many(payers)
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  users: one(user, {
    fields: [events.userId],
    references: [user.id],
  }),
  payers: many(payers),
}));

export const payersRelations = relations(payers, ({ one }) => ({
  events: one(events, {
    fields: [payers.eventId],
    references: [events.id],
  }),
  users: one(user, {
    fields: [payers.userId],
    references: [user.id],
  }),
}));
