import app from "./core/express";
// import "."; // ✅ This ensures the type augmentation is loaded


app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port: ${process.env.PORT || 8080}`);
});