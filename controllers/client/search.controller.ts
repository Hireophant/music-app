import { Request, Response } from "express";
import Song from "../../models/songs.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";


// [Get] /search/:type
export const result = async (req: Request, res: Response) => {
    const type = req.params.type;
    const keyword: string = req.query.keyword.toString();
    let newSongs = [];
    if(keyword) {
        const regex = new RegExp(keyword, "i");

        // Tạo ra slug không dấu, có thêm dấu - ngăn cách
        const stringSlug = convertToSlug(keyword);
        const regexSlug = new RegExp(stringSlug, "i");
        const songs = await Song.find({
            $or: [
                { title: regex },
                { slug: regexSlug }
            ]
        })
        for (const item of songs) {
            const infoSinger = await Singer.findOne({
                _id: item.singerId,
            })
            //item["infoSinger"] = infoSinger;
            newSongs.push({
                id: item.id,
                title: item.title,
                avatar: item.avatar,
                audio: item.audio,
                slug: item.slug,
                like: item.like,
                infoSinger: {
                    fullName: infoSinger.fullName,
                }
            })
        }
    }

    switch (type) {
        case "result":
            res.render("client/pages/search/result", {
                pageTitle: "Kết quả tìm kiếm",
                keyword: keyword,
                songs: newSongs
            });
            break;
        case "suggest":
            res.json({
                code: 200,
                message: "Thành công",  
                list: newSongs
            });
            break;
    
        default:
            break;
    }
};