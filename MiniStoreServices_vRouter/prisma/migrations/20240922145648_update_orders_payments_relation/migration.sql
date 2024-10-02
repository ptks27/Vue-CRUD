-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
