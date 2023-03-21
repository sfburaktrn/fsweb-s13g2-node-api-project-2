// posts için gerekli routerları buraya yazın
const express = require("express");
const Post = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((findPost) => {
      if (!findPost) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.json(findPost);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    try {
      let { id } = await Post.insert({ title, contents });
      let sendPost = await Post.findById(id);
      res.status(201).json(sendPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

router.put("/:id", async (req, res) => {
  let cPost = await Post.findById(req.params.id);
  if (!cPost) {
    res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
  } else {
    let { title, contents } = req.body;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
    } else {
      try {
        let updatedPostId = await Post.update(req.params.id, req.body);
        let updatedPost = await Post.findById(updatedPostId);
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
      }
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let cPost = await Post.findById(req.params.id);
    if (!cPost) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Post.remove(req.params.id);
      res.status(200).json(cPost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let cPost = await Post.findById(req.params.id);
    if (!cPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Post.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});
module.exports = router;
