import { useState } from "react";
import { Search, Filter, Download, Columns, X, Pencil, Plus, Trash2, TrendingUp, Upload, Pin, PinOff, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadDialog } from "@/components/advertising/UploadDialog";
import { cn } from "@/lib/utils";
import { useViewport } from "@/contexts/ViewportContext";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface SortableField {
  id: string;
  label: string;
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  activeFilters?: FilterRule[];
  onFiltersChange?: (filters: FilterRule[]) => void;
  columns?: Column[];
  onColumnToggle?: (columnId: string) => void;
  onSelectAllColumns?: () => void;
  onClearAllColumns?: () => void;
  onDownload?: () => void;
  onFilter?: () => void;
  filterCount?: number;
  viewMode?: "view" | "edit";
  onViewModeChange?: (mode: "view" | "edit") => void;
  showViewToggle?: boolean;
  filterFields?: string[];
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showDeltas?: boolean;
  onShowDeltasChange?: (show: boolean) => void;
  onUpload?: (files: File[]) => void;
  /** Override: when provided, the Upload button calls this instead of opening the internal UploadDialog. */
  onUploadClick?: () => void;
  showUpload?: boolean;
  uploadAccept?: string;
  uploadTitle?: string;
  uploadLabel?: string;
  pinnedColumns?: string[];
  onPinColumn?: (columnId: string) => void;
  // Sort props
  sortableFields?: SortableField[];
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
  onSortChange?: (field: string | null, direction: "asc" | "desc") => void;
}

const OPERATORS = [
  "is", "is not", "contains", "starts with",
  "is less than", "is greater than",
  "is less than or equal to", "is greater than or equal to",
];

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilters = [],
  onFiltersChange,
  columns = [],
  onColumnToggle,
  onSelectAllColumns,
  onClearAllColumns,
  onDownload,
  viewMode = "view",
  onViewModeChange,
  showViewToggle = false,
  filterFields = [],
  leftContent,
  rightContent,
  showDeltas,
  onShowDeltasChange,
  onUpload,
  onUploadClick,
  showUpload = false,
  uploadAccept,
  uploadTitle,
  uploadLabel,
  pinnedColumns = [],
  onPinColumn,
  sortableFields = [],
  sortField,
  sortDirection = "asc",
  onSortChange,
}: DataTableToolbarProps) {
  const [draftFilters, setDraftFilters] = useState<FilterRule[]>(activeFilters);
  const [columnSearch, setColumnSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);

  const handleOpenFilter = () => {
    setDraftFilters(activeFilters.length > 0 ? [...activeFilters] : [{ id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
    setFilterOpen(true);
  };

  const addFilterRule = () => {
    setDraftFilters([...draftFilters, { id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
  };

  const removeFilterRule = (id: string) => {
    setDraftFilters(draftFilters.filter((f) => f.id !== id));
  };

  const updateFilterRule = (id: string, key: keyof FilterRule, value: string) => {
    setDraftFilters(draftFilters.map((f) => f.id === id ? { ...f, [key]: value } : f));
  };

  const applyFilters = () => {
    const valid = draftFilters.filter((f) => f.field && f.value);
    onFiltersChange?.(valid);
    setFilterOpen(false);
  };

  const cancelFilters = () => {
    setFilterOpen(false);
    setDraftFilters(activeFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange?.([]);
    setFilterOpen(false);
    setDraftFilters([]);
  };

  const handleEditToggle = () => {
    if (viewMode === "edit") {
      setEditConfirmOpen(true);
    } else {
      onViewModeChange?.("edit");
    }
  };

  const handleEditSave = () => {
    setEditConfirmOpen(false);
    onViewModeChange?.("view");
  };

  const handleEditDiscard = () => {
    setEditConfirmOpen(false);
    onViewModeChange?.("view");
  };

  // Sort field toggle: 3-state per field (inactive → asc → desc → inactive)
  const handleSortFieldToggle = (fieldId: string) => {
    if (sortField !== fieldId) {
      // Different field selected → activate with asc
      onSortChange?.(fieldId, "asc");
    } else if (sortDirection === "asc") {
      onSortChange?.(fieldId, "desc");
    } else {
      // desc → inactive
      onSortChange?.(null, "asc");
    }
  };

  const filteredColumns = columns.filter((c) =>
    c.label.toLowerCase().includes(columnSearch.toLowerCase())
  );

  const { view } = useViewport();
  const isMobile = view === "mobile";

  return (
    <div className={cn("space-y-1.5", isMobile && "mobile-toolbar")} data-table-toolbar>
      {/* Main Toolbar Row */}
      <div className={cn(
        "flex items-center justify-between gap-2",
        isMobile ? "flex-col items-stretch" : "flex-wrap"
      )}>
        {/* Left Side */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Edit Mode Toggle — first position */}
          {showViewToggle && onViewModeChange && (
            <Button
              data-write-action
              variant="ghost"
              size="sm"
              className={cn("h-8 gap-1 text-xs cursor-pointer shrink-0", viewMode === "edit" && "bg-destructive/10 text-destructive")}
              onClick={handleEditToggle}
              title={viewMode === "edit" ? "Save & exit edit mode" : "Switch to Edit mode"}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span data-tb-label>Edit</span>
            </Button>
          )}
          {leftContent}
          <div className="relative min-w-0 flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-full pl-8 text-sm"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 flex-wrap" data-tb-actions>
          {rightContent}

          {/* Upload Button */}
          {(showUpload || onUpload || onUploadClick) && (
            <Button data-write-action variant="ghost" size="sm" className="h-8 gap-1 text-xs cursor-pointer" onClick={() => (onUploadClick ? onUploadClick() : setUploadOpen(true))} title={uploadTitle || "Upload files"}>
              <Upload className="h-3.5 w-3.5" />
              <span data-tb-label>{uploadLabel || "Upload"}</span>
            </Button>
          )}

          {/* Delta Toggle */}
          {onShowDeltasChange !== undefined && (
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={showDeltas || undefined}
              data-active={showDeltas || undefined}
              className={cn(
                "h-8 gap-1 text-xs cursor-pointer border",
                showDeltas
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground"
                  : "border-transparent"
              )}
              onClick={() => onShowDeltasChange(!showDeltas)}
              title={showDeltas ? "Hide deltas" : "Show deltas"}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span data-tb-label>Delta</span>
            </Button>
          )}

          {/* Sort Button — opens popover with field list */}
          {sortableFields.length > 0 && onSortChange && (
            <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 gap-1 text-xs cursor-pointer", sortField && "bg-primary/10 text-primary")}
                  title="Sort table data"
                >
                  {!sortField ? (
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  ) : sortDirection === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                  <span data-tb-label>Group By</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[220px] p-2 space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground px-2 pb-1">Group by</p>
                {sortableFields.map((field) => {
                  const isActive = sortField === field.id;
                  return (
                    <button
                      key={field.id}
                      onClick={() => handleSortFieldToggle(field.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span>{field.label}</span>
                      {isActive ? (
                        sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-30" />
                      )}
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          )}

          {/* Filter Button */}
          {filterFields.length > 0 && (
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs cursor-pointer" onClick={handleOpenFilter} title="Add or manage filters">
                  <Filter className="h-3.5 w-3.5" />
                  <span data-tb-label>Filter</span>
                  {activeFilters.length > 0 && (
                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[520px] max-w-[92vw] p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Filters</p>
                <div className="space-y-1.5">
                  {draftFilters.map((rule, idx) => (
                    <div key={rule.id} className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground w-10 shrink-0">{idx === 0 ? "Where" : "And"}</span>
                      <Select value={rule.field} onValueChange={(v) => updateFilterRule(rule.id, "field", v)}>
                        <SelectTrigger className="h-7 w-[130px] text-[11px]"><SelectValue placeholder="Field" /></SelectTrigger>
                        <SelectContent>
                          {filterFields.map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Select value={rule.operator} onValueChange={(v) => updateFilterRule(rule.id, "operator", v)}>
                        <SelectTrigger className="h-7 w-[160px] text-[11px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (<SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={rule.value}
                        onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
                        placeholder="Value..."
                        className="h-7 w-[110px] text-[11px]"
                      />
                      <button onClick={() => removeFilterRule(rule.id)} className="p-1 hover:bg-muted rounded cursor-pointer" title="Remove filter">
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button onClick={addFilterRule} className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
                    <Plus className="h-3 w-3" />Add Filter
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={cancelFilters} className="h-7 text-xs px-3">Cancel</Button>
                    <Button size="sm" onClick={applyFilters} className="h-7 text-xs px-3">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Columns Dropdown with Pin Toggle */}
          {columns.length > 0 && onColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs cursor-pointer" title="Toggle column visibility">
                  <Columns className="h-3.5 w-3.5" />
                  <span data-tb-label>Columns</span>
                  {pinnedColumns.length > 0 && (
                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary">
                      {pinnedColumns.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-0">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      placeholder="Search columns..."
                      className="h-7 pl-7 text-xs"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-1 border-b border-border">
                  <button onClick={onSelectAllColumns} className="text-xs text-primary hover:underline cursor-pointer">Select All</button>
                  <button onClick={onClearAllColumns} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Clear All</button>
                </div>
                <div className="max-h-[240px] overflow-auto p-1">
                  {pinnedColumns.length > 0 && onPinColumn && (
                    <>
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pinned</div>
                      {filteredColumns.filter(c => pinnedColumns.includes(c.id)).map((column) => (
                        <div key={`pinned-${column.id}`} className="flex w-full items-center gap-2 rounded-sm px-2 py-1 text-xs hover:bg-muted transition-colors">
                          <button onClick={() => onColumnToggle(column.id)} className="flex items-center gap-2 flex-1 cursor-pointer">
                            <Checkbox checked={column.visible} className="pointer-events-none h-3.5 w-3.5" />
                            <span className="text-foreground">{column.label}</span>
                          </button>
                          <button onClick={() => onPinColumn(column.id)} className="p-0.5 rounded hover:bg-primary/10 cursor-pointer" title="Unpin column">
                            <PinOff className="h-3 w-3 text-primary" />
                          </button>
                        </div>
                      ))}
                      <div className="h-px bg-border mx-1 my-1" />
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">All Columns</div>
                    </>
                  )}
                  {filteredColumns.filter(c => !pinnedColumns.includes(c.id)).map((column) => (
                    <div key={column.id} className="flex w-full items-center gap-2 rounded-sm px-2 py-1 text-xs hover:bg-muted transition-colors group">
                      <button onClick={() => onColumnToggle(column.id)} className="flex items-center gap-2 flex-1 cursor-pointer">
                        <Checkbox checked={column.visible} className="pointer-events-none h-3.5 w-3.5" />
                        <span className="text-foreground">{column.label}</span>
                      </button>
                      {onPinColumn && (
                        <button onClick={() => onPinColumn(column.id)} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-primary/10 cursor-pointer transition-opacity" title="Pin column">
                          <Pin className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export/Download Button — hidden on mobile */}
          {onDownload && (
            <Button data-write-action variant="ghost" size="sm" className="h-8 gap-1 text-xs cursor-pointer" onClick={onDownload} title="Export data">
              <Download className="h-3.5 w-3.5" />
              <span data-tb-label>Export</span>
            </Button>
          )}

        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && !filterOpen && (
        <div className="flex flex-wrap items-center gap-1.5 py-1.5">
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="outline" className="gap-1 pr-1 text-[11px] h-6 bg-muted/50 border-border">
              <span className="font-medium text-foreground">{filter.field}:</span>
              <span className="text-muted-foreground">{filter.operator}</span>
              <span className="text-foreground">{filter.value}</span>
              <button onClick={() => onFiltersChange?.(activeFilters.filter((f) => f.id !== filter.id))} className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer">
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          <button onClick={clearAllFilters} className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer">
            Clear all
          </button>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={onUpload}
        accept={uploadAccept}
        title={uploadTitle}
      />

      {/* Edit Save Confirmation */}
      <AlertDialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have made edits to this table. Would you like to save your changes or discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleEditDiscard}>Discard</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditSave}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
