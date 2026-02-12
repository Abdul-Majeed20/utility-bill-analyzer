export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const response = await fetch(
      "localhonst:/api/v1/updateSearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm, movie }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update search count");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};