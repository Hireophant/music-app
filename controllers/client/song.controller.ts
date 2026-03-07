import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/songs.model";
import Singer from "../../models/singer.model";


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

    res.render("client/pages/songs/detail", {
        pageTitle: `Chi tiết bài hát - ${song.title}`,
        song: song,
        singer: singer,
        topic: topic
    

    });


}