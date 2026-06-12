package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func fetchAllBucketData(s3Client *s3.Client, bucket string) error {

	presignClient := s3.NewPresignClient(s3Client)

	paginator := s3.NewListObjectsV2Paginator(s3Client, &s3.ListObjectsV2Input{
		Bucket: &bucket,
	})
	fmt.Println("Starting bucket data download...")

	for paginator.HasMorePages() {
		page, err := paginator.NextPage(context.TODO())
		if err != nil {
			log.Fatalf("failed to get page of objects, %v", err)
		}

		for _, object := range page.Contents {
			downloadURL, err := getPresignedURL(presignClient, bucket, *object.Key, 20*time.Minute)
			if err != nil {
				log.Printf("Error generating link for %s: %v", *object.Key, err)
				continue
			}
			fmt.Printf("%s : %s\n", *object.Key, downloadURL)
		}
	}
	fmt.Println("All data fetched successfully.")
	return nil
}

func getPresignedURL(presignClient *s3.PresignClient, bucket, key string, lifetime time.Duration) (string, error) {
	contentType := "application/octet-stream"
	request, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket:              &bucket,
		Key:                 &key,
		ResponseContentType: &contentType,
	}, func(opts *s3.PresignOptions) {
		opts.Expires = lifetime
	})
	if err != nil {
		return "", err
	}

	return request.URL, nil
}
