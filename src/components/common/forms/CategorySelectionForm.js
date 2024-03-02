import { useDisclosure } from "@nextui-org/react";
import { useEffect } from "react";
import { categoryOptions as categories } from "@/data/categories";
import ErrorModal from "../modals/ErrorModal";
import { Button } from "@nextui-org/button";

export default function CategorySelectionForm(props) {
  const {
    selectedCategories,
    setSelectedCategories,
    numCategoriesSelected,
    setNumCategoriesSelected,
    maxNumCategories,
  } = props;

  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();

  const handleCategoryClick = (index) => {
    if (selectedCategories[index] === true) {
      // This means the user is deselecting the category, so decrement the count of selected category
      setNumCategoriesSelected(numCategoriesSelected - 1);
    } else {
      // This means the user is selecting the category, so increment the count of selected categories
      if (numCategoriesSelected === maxNumCategories) {
        // This if block catches the case where the user is trying to add a category even though they're at the cap
        onErrorModalOpen();
        return;
      }
      setNumCategoriesSelected(numCategoriesSelected + 1);
    }
    setSelectedCategories((oldCategoriesSelected) => {
      var newCategories = oldCategoriesSelected.slice();
      newCategories[index] = !newCategories[index];
      return newCategories;
    });
  };

  const handleClearAllCategoryPicks = () => {
    setNumCategoriesSelected(0);
    const clearedCategorySelection = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      clearedCategorySelection[i] = false;
    }
    setSelectedCategories(clearedCategorySelection);
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      for (var i = 0; i < categories.length; i++) {
        selectedCategories[i] = false;
      }
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <p className="font-semibold text-xl">{`${numCategoriesSelected} out of ${maxNumCategories} categories selected`}</p>
      <div className="flex flex-col gap-4 text-center px-4">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={selectedCategories[index] ? "solid" : "light"}
            color={selectedCategories[index] ? "success" : ""}
            className="whitespace-normal md:truncate md:text-lg"
            size="sm"
            onPress={() => handleCategoryClick(index)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex flex-row justify-center">
        <Button color="danger" size="md" onPress={handleClearAllCategoryPicks}>
          Clear Selected Categories
        </Button>
      </div>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
        headerText="Category Selection Error"
        bodyText="Maximum number of categories reached. You must deselect a category in order to pick another one."
      />
    </div>
  );
}
