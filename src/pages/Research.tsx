import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchOpinions, type Opinion } from "@/lib/courtListener";
import { calculateSimilarity } from "@/lib/ai21";
import { Textarea } from "@/components/ui/textarea";

interface OpinionWithSimilarity extends Opinion {
  similarityScore?: number;
}

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourt, setSelectedCourt] = useState("scotus");
  const [results, setResults] = useState<OpinionWithSimilarity[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["opinions", searchQuery, selectedCourt, currentPage],
    queryFn: () => searchOpinions(searchQuery, selectedCourt, currentPage),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.results) return;

    const opinionsWithSimilarity = await Promise.all(
      data.results.map(async (opinion) => {
        const similarityScore = await calculateSimilarity(
          caseSummary,
          opinion.plain_text || ""
        );
        return { ...opinion, similarityScore };
      })
    );

    // Sort by similarity score
    const sortedOpinions = opinionsWithSimilarity.sort(
      (a, b) => (b.similarityScore || 0) - (a.similarityScore || 0)
    );

    setResults(sortedOpinions);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Legal Research</h1>
          <p className="text-muted-foreground mt-2">
            Search similar cases using case summary or keywords
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Case Summary</label>
            <Textarea
              placeholder="Enter a summary of your case..."
              value={caseSummary}
              onChange={(e) => setCaseSummary(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Additional search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !caseSummary}>
              <Search className="mr-2 h-4 w-4" />
              Find Similar Cases
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center">
            <p className="text-muted-foreground">Analyzing cases...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-destructive">
            <p>Error analyzing cases. Please try again.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((opinion) => (
              <Card key={opinion.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">
                      <a
                        href={opinion.absolute_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Case #{opinion.id}
                      </a>
                    </h3>
                    {opinion.similarityScore !== undefined && (
                      <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">
                        {opinion.similarityScore}% Similar
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Author: {opinion.author || "Unknown"}
                  </p>
                  <p className="text-sm">
                    {opinion.plain_text?.slice(0, 200)}...
                  </p>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-muted-foreground">Page {currentPage}</span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!data?.next || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Research;
