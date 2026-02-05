import { Asset } from '../models/Asset';

export class AssetService {
    static async getAssetsByUser(userId: string) {
        return Asset.find({ userId }).sort({ createdAt: -1 });
    }

    static async createAsset(userId: string, data: any) {
        const asset = new Asset({
            userId,
            ...data
        });
        return asset.save();
    }

    static async updateAsset(id: string, updates: any) {
        return Asset.findByIdAndUpdate(id, updates, { new: true });
    }

    static async deleteAsset(id: string) {
        return Asset.findByIdAndDelete(id);
    }
}
