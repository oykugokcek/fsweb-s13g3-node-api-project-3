const express = require("express");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();
const Posts = require("../posts/posts-model");
const Users = require("./users-model");

router.get("/", (req, res) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: "Kullanıcılar alınamadı" });
    });
});

router.get("/:id", (req, res) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı." });
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı." });
    });
});

router.post("/", (req, res) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  let user = req.body;
  if (!user.name) {
    res.status(400).json({ message: "Lütfen geçerli bir isim giriniz. " });
  } else {
    Users.insert(user)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Veritabanına kaydederken hata oluştu." });
      });
  }
});

router.put("/:id", async (req, res) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    let existUser = await Users.getById(req.params.id);
    if (!existUser) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı." });
    } else {
      let newUser = req.body;
      if (!newUser.name) {
        res.status(400).json({ message: "Lütfen geçerli bir isim giriniz. " });
      } else {
        console.log(req.params);
        console.log(newUser);
        let updatedUser = await Users.update(req.params.id, newUser);
        console.log(updatedUser);
        res.status(201).json(updatedUser);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı güncellenemedi." });
  }
});

router.delete("/:id", async (req, res) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try {
    let deletedUser = await Users.getById(req.params.id);
    if (!deletedUser) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı." });
    } else {
      await Users.remove(req.params.id);
      res.status(200).json(deletedUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi." });
  }
});

router.get("/:id/posts", async (req, res) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try {
    let postObj = await Posts.getById(req.params.id);
    if (!postObj) {
      res.status(400).json({ message: "Girilen ID'li post bulunamadı." });
    } else {
      console.log("slm");
      let post = await Posts.getUserPosts(req.params.id);
      console.log(post);
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Post bulunamadı" });
  }
});

router.post("/:id/posts", (req, res) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
});

// routerı dışa aktarmayı unutmayın

module.exports = router;
