import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
const CandidateTable = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const q = query(collection(db, "Users"), where("type", "==", "student"));
      const querySnapshot = await getDocs(q);
      const candidatesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedCandidates = candidatesList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setCandidates(sortedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="p-8">
        <Table>
          <TableCaption>A list of all candidates on the platform</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.name|| "N/A"}</TableCell>
                <TableCell>{candidate.email || "N/A"}</TableCell>
                <TableCell>{candidate.projects || 0}</TableCell>
                <TableCell className="text-right">{candidate.rating || "Unrated"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CandidateTable;
