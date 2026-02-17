export default async function PostPages() {
  const res = await fetch("https://dummyjson.com/posts");
  const data = await res.json();

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data.posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}