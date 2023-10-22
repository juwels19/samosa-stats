export default function CategoryList(props) {
  const { categories } = props;
  return (
    <div className="flex flex-col gap-4 text-center px-4">
      {categories.map((category) => (
        <p key={category}>{category}</p>
      ))}
    </div>
  );
}
