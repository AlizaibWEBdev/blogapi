const blog = require("../models/blog");
const ApiError = require("../utils/ApiError");
const user = require("../models/user")

const blogController = {
    async read(req, res, next) {
        try {

            const id = req.body?.id || req.query.id;


            if (!id) {
                return next(new ApiError(404, "please provide id "))
            }

            const artical = await blog
                .findOne({ blog_id: id, upload: true })
                .populate({
                    path: "author_id",
                    select: "-refreshtoken -interests -liked_posts -saved_posts -email -password"
                });

            if (!artical) {
                return next(new ApiError(404, "Artical not found"))
            }





            res.status(200).json(artical);

        } catch (error) {
            next(error);
        }
    },
    async readAll(req, res, next) {
        try {
            const allArticals = await blog.find({ upload: true })
                .populate({
                    path: "author_id",
                    select: "-bio -dob -refreshtoken -interests -liked_posts -saved_posts -email -password"
                });

            if (allArticals) {
                res.status(200).json(allArticals)
            }
        } catch (error) {
            next(error)
        }
    },
    async readUserArticals(req, res, next) {
        try {
            const user_id = req.query.id;
            const allArticals = await blog.find({ author_id: user_id, upload: true });
            if (allArticals) {
                res.status(200).json(allArticals)
            }
        } catch (error) {
            next(error)
        }
    },
    async readArchiveArticals(req, res, next) {
        let id = req.body.id
        if (!id) {
            return next(new ApiError(400, "please provide id "))
        }

        if (req.user.id === req.body.id) {
            try {

                const allArticals = await blog.find({ author_id: req.body.id, upload: false });
                if (allArticals) {
                    res.status(200).json(allArticals)
                }
            } catch (error) {
                next(error)
            }
        }
    },
    async readLikedArticals(req, res, next) {
        if (!(req.body.id)) {
            return next(new ApiError(400, "please provide id "))
        }

        if (req.user.id === req.body.id) {
            try {

                const allArticals = await user.find({ _id: req.user.id }).select("liked_posts").populate("liked_posts")
                if (allArticals) {
                    res.status(200).json(allArticals)
                }
            } catch (error) {
                next(error)
            }
        }
    },
    async readSavedArticals(req, res, next) {
        if (!(req.body.id)) {
            return next(new ApiError(400, "please provide id "))
        }

        if (req.user.id === req.body.id) {
            try {

                const allArticals = await user.find({ _id: req.user.id }).select("saved_posts").populate("saved_posts")
                if (allArticals) {
                    res.status(200).json(allArticals)
                }
            } catch (error) {
                next(error)
            }
        }
    },


    async like(req, res, next) {
        if (!(req.body.blog_id && req.body.user_id)) {
            return next(new ApiError(400, "please provide user and blog id "))
        }
        if (req.user.id === req.body.user_id) {
            try {
                const blogTOlike = await blog.findOne({ blog_id: req.body.blog_id });
                const liked_posts = await user.find({ _id: req.user.id });
                res.json(liked_posts);
                // if (liked_posts.liked_posts[0].liked_posts.includes(req.body.blog_id)) {
                //     blogTOlike.likes--
                //     await blogTOlike.save();
                //     return res.json({ likes: blogTOlike.likes, byuser: false });
                // }

                // blogTOlike.likes++
                // await blogTOlike.save();
                // return res.json({ likes: blogTOlike.likes, byuser: true });

            } catch (err) {
                next(err);
            }
        }

    },
    async save(req, res, next) {


        if (!(req.body.blog_id && req.body.user_id)) {
            return next(new ApiError(400, "please provide user and blog id "))
        }
        if (req.user.id === req.body.user_id) {
            try {
                const blogTOSave = await blog.findOne({ blog_id: req.body.blog_id });
                const savedPosts = await user.find({ _id: req.user.id });
                if (savedPosts[0].saved_posts.includes(req.body.blog_id)) {
                    const remaining_posts = savedPosts.filter((e)=>{
                        return e!== blogTOSave;
                    });

                    savedPosts.

                    
                    saved_posts.saved_posts
                    await blogTOlike.save();
                    return res.json({ likes: blogTOlike.likes, byuser: false });
                }

                blogTOlike.likes++
                await blogTOlike.save();
                return res.json({ likes: blogTOlike.likes, byuser: true });

            } catch (err) {
                next(err);
            }
        }


     },
    async comment(req, res, next) { },

    async write(req, res, next) {
        console.log("requtes puchi wai ", req.body);
        try {
            const { title, description, image, upload, author_id, blog_id } = req?.body;

            const id = req.user.id || author_id;
            if (!(title && description && blog_id && id)) {
                console.log(title, description, blog_id, id, upload);
                return next(new ApiError(400, ' please fill all the fields'))

            }


            const oldArtical = await blog.findOne({ blog_id })

            if (oldArtical && oldArtical?.blog_id == blog_id) {
                oldArtical.title = title
                oldArtical.description = description
                oldArtical.author_id = id
                oldArtical.upload = upload
                oldArtical.image = image || null
                oldArtical.blog_id = blog_id
                await oldArtical.save();
                return res.status(200).json({
                    message: "artical updated !"
                })
            }

            const newblog = new blog({ title, description, author_id: id, upload, image, blog_id })
            await newblog.save();
            return res.status(200).json({
                message: "artical created !"
            })

        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const artical_id = req.body?.id || req.query.id;
            if (!artical_id) {
                return next(new ApiError(400, 'please provide id to delete artical'))
            }
            const articalTodelete = await blog.findById(artical_id);
            if (!articalTodelete) {
                return next(new ApiError(400, 'invalid artical id'))
            }
            if (articalTodelete.author_id !== req.user.id) {
                return next(new ApiError(401, 'Forbidden: you are not allowed to delete this artical'))
            }

            const deleteArtical = await blog.findByIdAndDelete(artical_id);
            if (deleteArtical) {
                res.status(200).json({ message: "artical deleted" });
            }

        } catch (error) {
            next(error)
        }
    },
    async publish(req, res, next) {

        try {
            const artical_id = req.body?.id || req.query.id;
            if (!artical_id) {
                return next(new ApiError(400, 'please provide id to publish artical'))
            }
            const articalTopublish = await blog.findById(artical_id);
            if (!articalTopublish) {
                return next(new ApiError(400, 'invalid artical id'))
            }
            if (articalTopublish.author_id !== req.user.id) {
                return next(new ApiError(401, 'Forbidden: you are not allowed to publsih this artical'))
            }

            articalTopublish.upload = true;
            const published = await articalTopublish.save();
            if (published) {
                res.status(200).json({ message: "artical published" });
            }

        } catch (error) {
            next(error)
        }
    },
    async archive(req, res, next) {

        try {
            const artical_id = req.body?.id || req.query.id;
            if (!artical_id) {
                return next(new ApiError(400, 'please provide id to archive artical'))
            }
            const articalTopublish = await blog.findById(artical_id);
            if (!articalTopublish) {
                return next(new ApiError(400, 'invalid artical id'))
            }
            if (articalTopublish.author_id !== req.user.id) {
                return next(new ApiError(401, 'Forbidden: you are not allowed to archive this artical'))
            }

            articalTopublish.upload = false;
            const published = await articalTopublish.save();
            if (published) {
                res.status(200).json({ message: "artical archived" });
            }

        } catch (error) {
            next(error)
        }
    }
}

module.exports = blogController;