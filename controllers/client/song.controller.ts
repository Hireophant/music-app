import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";


// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
    const topic = await Topic.findOne({ slug: req.params.slugTopic, status: "active", deleted: false });
    const songs = await Song.find({ topicId: topic.id, status: "active", deleted: false }).select("title avatar singerId like slug");
    for (const song of songs) {
        const infoSinger = await Singer.findOne({ _id: song.singerId, status: "active", deleted: false }).select("fullName");
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/list", {
        pageTitle: `Danh sách bài hát - ${topic.title}`,
        songs: songs
    });
}

// [Get] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => { 
    const slugSong: string = req.params.slugSong.toString();
    const song = await Song.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    })
    const singer = await Singer.findOne({
        _id: song.singerId,
        deleted: false
    })
    const topic = await Topic.findOne({
        _id: song.topicId,
        deleted: false
    })

    const existFavoriteSong = await FavoriteSong.findOne({
        songId: song.id
    });
    if (existFavoriteSong) {
        song["isFavorite"] = true;
    } else {
        song["isFavorite"] = false
    }
    res.render("client/pages/songs/detail", {
        pageTitle: `Chi tiết bài hát - ${song.title}`,
        song: song,
        singer: singer,
        topic: topic
    

    });


}

// [Patch] /songs/yes/typeLike/:idSong
export const like  = async (req: Request, res: Response) => { 
    const idSong: string = req.params.idSong.toString();
    const typeLike: string = req.params.typeLike.toString();
    const song = await Song.findOne({
        _id: idSong,
        status: "active",
        deleted: false
    });

    const newLike: number = typeLike == "like" ? song.like + 1 : song.like - 1;

    // updatesong.like + 1
    await Song.updateOne({
        _id: idSong,
    }, {
        like: newLike
    })

    res.json({
        code: 200,
        message: "Thành công",
        like: newLike
    })



}

// [Patch] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong.toString();
    const typeFavorite: string = req.params.typeFavorite.toString();

    switch (typeFavorite) {
        case "favorite":
            const existFavoriteSong = await FavoriteSong.findOne({
                songId: idSong
            });
            if (!existFavoriteSong) {
                const record = new FavoriteSong({
                    // userId: "",
                    songId: idSong
                });
                await record.save();
            }
            break;
        case "unfavorite":
            await FavoriteSong.deleteOne({
                songId: idSong
            });
            break;
        default:
            break;
    }

    res.json({
        code: 200,
        message: "Thành công"
    });
}

// [Patch] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong.toString();
    const song = await Song.findOne({
        _id: idSong,
    });
    const newListen: number = song.listen + 1;
    await Song.updateOne({
        _id: idSong,
    }, {
        listen: newListen
    })
    const songNew = await Song.findOne({
        _id: idSong,
    })
    res.json({
        code: 200,
        message: "Thành công",
        listen: songNew.listen
    })
}