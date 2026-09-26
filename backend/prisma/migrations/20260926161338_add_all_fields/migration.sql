-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "whatsappLink" TEXT;
