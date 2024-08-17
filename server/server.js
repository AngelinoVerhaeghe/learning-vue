const express = require( "express" );
const { PrismaClient } = require( "@prisma/client" );
const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const cors = require( "cors" );
const { body, validationResult } = require( "express-validator" );
require( "dotenv" ).config();

const prisma = new PrismaClient();
const port = process.env.PORT || 8000;
const secretKey = "your_secret_key";

const app = express();

app.use( cors( {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
} ) );

app.use( express.json() );

// Endpoint to get the list of posts with author details
app.get( "/api/posts", async ( req, res ) => {
  try {
    const posts = await prisma.post.findMany( {
      include: {
        author: true
      }
    } );

    // Sent the response as object with message and posts!!
    res.status( 200 ).json( {
      message: "Posts fetched successfully!",
      posts: posts
    } );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( {
      message: "An error occurred while fetching posts.",
      error: error.message
    } );
  }
} );

// Endpoint to get one post by slug and author details
app.get( "/api/posts/:slug", async ( req, res ) => {
  const slug = req.params.slug;

  try {
    const post = await prisma.post.findUnique( {
      where: {
        slug: slug
      },
      include: {
        author: true
      }
    } );

    if ( !post ) {
      return res.status( 404 ).json( {
        message: `Post with slug "${ slug }" was not found!`
      } );
    }

    res.status( 200 ).json( {
      message: "Post fetched successfully!",
      post: post
    } );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( {
      message: "An error occurred while fetching the post.",
      error: error.message
    } );
  }
} );

// Create post endpoint
app.post( "/api/posts", [
  body( "title" ).notEmpty().withMessage( "Title is required" ),
  body( "description" ).notEmpty().withMessage( "Description is required" ),
  body( "date" ).notEmpty().withMessage( "Date is required" )
], async ( req, res ) => {
  const errors = validationResult( req );
  if ( !errors.isEmpty() ) {
    return res.status( 400 ).json( { errors: errors.array() } );
  }

  const { title, slug, description, image, author_id, is_published, date } = req.body;

  try {
    const post = await prisma.post.create( {
      data: {
        title: title,
        slug: slug,
        description: description,
        image: image,
        author_id: author_id,
        is_published: is_published,
        date: new Date( date ).toISOString()
      }
    } );

    res.status( 201 ).json( {
      message: "Post created successfully!",
      post: post
    } );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( {
      message: "An error occurred while creating the post.",
      error: error.message
    } );
  }
} );

// Endpoint to delete a post
app.delete("/api/posts/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { slug: slug },
    });

    if (!post) {
      // If the post does not exist, send a 404 response
      return res.status(404).json({ message: `Post with slug "${slug}" not found` });
    }

    // Delete the post from the database
    await prisma.post.delete({
      where: { slug: slug },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the post.",
      error: error.message
    });
  }
});

// Endpoint to edit a post
app.put("/api/posts/:slug", [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("date").notEmpty().withMessage("Date is required")
], async (req, res) => {
  const slug = req.params.slug;

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { slug: slug },
      include: {
        author: true
      }
    });

    if (!post) {
      // If the post does not exist, send a 404 response
      return res.status(404).json({ message: `Post with slug "${slug}" not found` });
    }

    // Update the post in the database
    const updatedPost = await prisma.post.update({
      where: { slug: slug },
      data: {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        author: {
          connect: { id: req.body.author.id } // Prisma will automatically connect the author with the given id
        },
        is_published: req.body.is_published,
        date: new Date(req.body.date),
      },
    });

    res.status(200).json({
      message: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the post.",
      error: error.message
    });
  }
});

// Endpoint to register a new user
app.post( "/api/register", [
  body( "user_name" ).notEmpty().withMessage( "User name is required" ),
  body( "email" ).isEmail().withMessage( "Valid email is required" ),
  body( "password" ).isLength( { min: 6 } ).withMessage( "Password must be at least 6 characters" )
], async ( req, res ) => {

  const errors = validationResult( req );
  if ( !errors.isEmpty() ) {
    return res.status( 400 ).json( { errors: errors.array() } );
  }

  const { user_name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique( { where: { email } } );
    if ( existingUser ) {
      return res.status( 400 ).json( { message: `Email: ${ email } is already in use.` } );
    }

    const hashedPassword = await bcrypt.hash( password, 10 );

    const user = await prisma.user.create( {
      data: {
        first_name: "",
        last_name: "",
        user_name: user_name,
        email: email,
        password: hashedPassword,
        is_active: true
      }
    } );

    const token = jwt.sign( { id: user.id, email: user.email }, secretKey, { expiresIn: "1h" } );

    res.status( 201 ).json( {
      message: "User registered successfully!",
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email
      }
    } );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( {
      message: "An error occurred while registering the user.",
      error: error.message
    } );
  }
} );

// Endpoint to log in a user
app.post( "/api/login", [
  body( "email" ).isEmail().withMessage( "Valid email is required" ),
  body( "password" ).isLength( { min: 6 } ).withMessage( "Password is required" )
], async ( req, res ) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique( { where: { email } } );
    if ( !user ) {
      return res.status( 401 ).json( { error: `Invalid email` } );
    }

    const isPasswordValid = await bcrypt.compare( password, user.password );
    if ( !isPasswordValid ) {
      return res.status( 401 ).json( { error: "Invalid password" } );
    }

    const token = jwt.sign( { id: user.id, email: user.email }, secretKey, { expiresIn: "1h" } );

    res.status( 200 ).json( {
      message: "User logged in successfully!",
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email
      }
    } );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( {
      message: "An error occurred while logging in the user.",
      error: error.message
    } );
  }
} );

// Endpoint to get the list of users
app.get( "/api/users", async ( req, res ) => {
  try {
    const users = await prisma.user.findMany();

    if ( !users.length ) {
      return res.status( 404 ).json( {
        message: "No users found!"
      } );
    }

    res.status( 200 ).json( {
      message: "Users fetched successfully!",
      users: users
    } );
  } catch (error) {
    console.error( error );
    res.status( 500 ).json( {
      message: "An error occurred while fetching users.",
      error: error.message
    } );
  }
} );

app.listen( port, () => {
  console.log( `Server is running on port: ${ port }` );
} );
