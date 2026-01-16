import Link from "next/link";

export default async function  PostPages() {
const reponse = await fetch("https://dummyjson.com/posts");
  const data = await reponse.json();
  //console.log(data);

    return(
        <div>
            <h1>Posts!!!</h1>
            <ul>
                {data.posts.map((post) =>(
                    <li key={post.id}>
                        <Link href={`/posts/${post.id}`}>
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}