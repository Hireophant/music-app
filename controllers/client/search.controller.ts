import { Request, Response } from "express";
import Song from "../../models/songs.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";


// [Get] /search/result
export const result = async (req: Request, res: Response) => {
    const keyword: string = req.query.keyword.toString();
    let newSongs = [];
    if(keyword) {
        const regex = new RegExp(keyword, "i");

        // Tạo ra slug không dấu, có thêm dấu - ngăn cách
        const stringSlug = convertToSlug(keyword);
        const regexSlug = new RegExp(stringSlug, "i");
        newSongs = await Song.find({
            $or: [
                { title: regex },
                { slug: regexSlug }
            ]
        })
        for (const item of newSongs) {
            const infoSinger = await Singer.findOne({
                _id: item.singerId,
            })
            item["infoSinger"] = infoSinger;
        }
    }
    res.render("client/pages/search/result", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        songs: newSongs
    });
};