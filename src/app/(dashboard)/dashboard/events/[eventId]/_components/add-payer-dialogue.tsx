"use client";
import React, { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { FormField, Form, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddPayerSchema } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPayer } from "@/actions/payers";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPayerDetailsByName } from "@/data/payers";
import { getAllPayersCities } from "@/data/payers";
import { useClickAway, useDebounce } from "react-use";
import { Textarea } from "@/components/ui/textarea";
import { useSuggestions } from "@/app/hooks/use-suggestions";
import SuggestionList from "./suggestion-list";
import { getErrorMessage } from "@/lib/handle-errors";

type Props = {
  isOpen: boolean;
  eventId: string;
  onAddUserOpenChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddPayerDialogue({ isOpen, onAddUserOpenChanges, eventId }: Props) {
  const { 
  query : nameQuery, 
    setQuery: setNameQuery, 
    suggestions: nameSuggestions,
    isLoading: nameSugIsLoading, 
    setIsLoading: setNameSugIsLoading 
  } = useSuggestions("", getPayerDetailsByName as any);
  const {
     query: cityQuery, 
     setQuery: setCityQuery, 
     suggestions: citySuggestions, 
     isLoading: citySugIsLoading, 
     setIsLoading: setCitySugIsLoading 
    } = useSuggestions("", getAllPayersCities as any);
  const [isNameSelectionOpen, setIsNameSelectionOpen] = useState(false);
  const [isCitySelectionOpen, setIsCitySelectionOpen] = useState(false);
  const nameFilterRef = useRef(null);
  const cityFilterRef = useRef(null);
  const [isAddPayerPending, startAddPayerTransition] = useTransition();

  const form = useForm<z.infer<typeof AddPayerSchema>>({
    resolver: zodResolver(AddPayerSchema),
    defaultValues: {
      name: "",
      city: undefined,
      description: undefined,
      amount: 0,
    },
  });
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    
    field.onChange(e.target.value);
    setNameQuery(e.target.value);
    setIsNameSelectionOpen(!!e.target.value);
    setNameSugIsLoading(!!e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    field.onChange(e.target.value);
    setCityQuery(e.target.value);
    setIsCitySelectionOpen(!!e.target.value);
    setCitySugIsLoading(!!e.target.value);
  };

  useClickAway(nameFilterRef, () => setIsNameSelectionOpen(false));
  useClickAway(cityFilterRef, () => setIsCitySelectionOpen(false));

  const handleSuggestClick = (suggestion: any) => {
    form.setValue("name", suggestion.name);
    form.setValue("city", suggestion.city ?? "");
    setIsNameSelectionOpen(false);
  };

  const handleCitySuggestClick = (suggestion: any) => {
    form.setValue("city", suggestion.city ?? "");
    setIsCitySelectionOpen(false);
  };
  const submitHandler = (values: z.infer<typeof AddPayerSchema>) => {
    startAddPayerTransition(() => {
      const toastId = toast('Sonner');
      toast.loading("Loading....",{id:toastId})
      addPayer(values, eventId as string)
        .then(data => {
          if (data?.error) {
            toast.error(data.error,{id:toastId});
          }
          if (data?.success) {
            toast.success(data.success,{id:toastId});
            onAddUserOpenChanges(false);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onAddUserOpenChanges} modal>
      <DialogContent
        onInteractOutside={e => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form autoComplete="off" className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader className="font-bold">Add Payer</DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Name</FormLabel>
                    <FormControl>
                      <div ref={nameFilterRef} className="relative">
                        <Input {...field} type="text" onChange={e => handleNameChange(e, field)} placeholder="Ranjan" disabled={isAddPayerPending} />
                        {isNameSelectionOpen && <SuggestionList suggestions={nameSuggestions} isLoading={nameSugIsLoading} isSelectionOpen={isNameSelectionOpen} handleSuggestClick={handleSuggestClick}
                        renderSuggestion={(suggestion) => (
                          <>
                          <span>{suggestion.name}</span>
                          <span>{suggestion.city ?? 'N/A'}</span>
                          </>
                        )}
                         />}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Place(Optional)</FormLabel>
                    <FormControl>
                      <div ref={cityFilterRef} className="relative">
                        <Input {...field} type="text" placeholder="Kannikapuri" onChange={e => handleCityChange(e, field)} disabled={isAddPayerPending} />
                        {isCitySelectionOpen && <SuggestionList suggestions={citySuggestions} isLoading={citySugIsLoading} isSelectionOpen={isCitySelectionOpen} handleSuggestClick={handleCitySuggestClick}
                        renderSuggestion={(suggestion)=><span>{suggestion.city}</span>}
                        />}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details (optional)</FormLabel>
                    <FormControl>
                      <Textarea disabled={isAddPayerPending} placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={field.onChange} placeholder="Enter amount" disabled={isAddPayerPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isAddPayerPending}>
                {isAddPayerPending && <Loader2 className="size-4 mr-2 animate-spin" />} Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

