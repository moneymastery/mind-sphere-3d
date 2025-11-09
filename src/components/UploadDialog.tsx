import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, FileJson, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadDialog = ({ open, onOpenChange }: UploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/json"];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or JSON file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 25MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // TODO: Implement actual upload processing with AI
    toast({
      title: "Upload received!",
      description: `Processing ${selectedFile.name}... AI integration coming soon!`,
    });

    // Reset and close
    setSelectedFile(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-primary/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Upload Mind Map</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a notebook image (PNG/JPG) or existing mind map (JSON) to visualize in 3D
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,application/json"
                onChange={handleFileInput}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Supported: PNG, JPG, JSON (max 25MB)
              </p>
            </div>
          ) : (
            <div className="glass-panel p-4 rounded-lg border border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedFile.type.startsWith("image/") ? (
                    <FileImage className="w-8 h-8 text-primary" />
                  ) : (
                    <FileJson className="w-8 h-8 text-secondary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 node-glow"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              <Upload className="w-4 h-4 mr-2" />
              Process File
            </Button>
          </div>

          <div className="glass-panel p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-semibold">Coming soon:</span> AI-powered
              processing will convert notebook images to mind maps using OCR and generate
              structured visualizations from your uploads
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
