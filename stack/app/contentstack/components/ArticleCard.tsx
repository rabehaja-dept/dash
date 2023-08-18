import { Link } from "@remix-run/react";
import { Article } from "~/@types/generated/contentstack/generated";

export const ArticleCard = ({ title, uid, url, file }: Article) => {
  return (
    <>
      <Link key={uid} to={`/contentstack${url}`}>
        <div className="hover:opacity-60">
          {file && (
            <div>
              <img
                src={file.url}
                alt={file.filename}
                className="max-h-72 w-full object-cover"
              />
            </div>
          )}
          <div className="mt-3">
            <h2>{title}</h2>
          </div>
        </div>
      </Link>
    </>
  );
};
