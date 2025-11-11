DROP INDEX `accounts_userId_idx`;--> statement-breakpoint
DROP INDEX `sessions_userId_idx`;--> statement-breakpoint
DROP INDEX `verifications_identifier_idx`;--> statement-breakpoint
ALTER TABLE `users` ADD `username` text;--> statement-breakpoint
ALTER TABLE `users` ADD `display_username` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);