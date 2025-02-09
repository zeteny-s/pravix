import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasNextPage: boolean;
  isLoading: boolean;
}

export const DocumentPagination = ({
  currentPage,
  setCurrentPage,
  hasNextPage,
  isLoading,
}: DocumentPaginationProps) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <span className="text-muted-foreground">Page {currentPage}</span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
